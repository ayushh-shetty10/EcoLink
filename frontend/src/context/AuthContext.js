import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import profileService from '../services/profileService';
import institutionService from '../services/institutionService';
import sessionManager from '../utils/sessionManager';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('individual');
  const [needsInstitutionProfile, setNeedsInstitutionProfile] = useState(false);
  const [needsUserProfile, setNeedsUserProfile] = useState(false);
  const [signupRole, setSignupRole] = useState('individual');
  const [loading, setLoading] = useState(true);

  const ensureProfile = async (baseUser) => {
    if (!baseUser?.id) return null;

    const existing = await profileService.getProfileById(baseUser.id);
    if (!existing.error && existing.data) {
      return existing.data;
    }

    const metadataRole = baseUser.user_metadata?.role;
    const inferredRole = metadataRole === 'institution' ? 'institution' : 'individual';

    const created = await profileService.createProfileForUser({
      id: baseUser.id,
      email: baseUser.email,
      role: inferredRole,
      full_name: baseUser.email?.split('@')[0] || 'EcoLink User',
      profile_completed: false,
    });

    if (!created.error && created.data) {
      return created.data;
    }

    return null;
  };

  const hydrateSessionUser = async (baseUser) => {
    if (!baseUser) {
      setUser(null);
      setProfile(null);
      setRole('individual');
      setNeedsInstitutionProfile(false);
      setNeedsUserProfile(false);
      return;
    }

    const fetchedProfile = await ensureProfile(baseUser);
    const nextRole = fetchedProfile?.role || baseUser.user_metadata?.role || 'individual';

    setProfile(fetchedProfile || null);
    setRole(nextRole);
    setUser({ ...baseUser, profile: fetchedProfile || null });

    if (nextRole === 'institution') {
      const institution = await institutionService.getInstitutionById(baseUser.id);
      setNeedsInstitutionProfile(!!institution.error || !institution.data);
      setNeedsUserProfile(false);
      return;
    }

    // Check profile completion for individual users
    if (nextRole === 'individual') {
      const isProfileComplete = fetchedProfile?.profile_completed === true;
      setNeedsUserProfile(!isProfileComplete);
    }

    setNeedsInstitutionProfile(false);
  };

  const refreshInstitutionStatus = async () => {
    if (!user?.id || role !== 'institution') {
      setNeedsInstitutionProfile(false);
      return;
    }

    const institution = await institutionService.getInstitutionById(user.id);
    setNeedsInstitutionProfile(!!institution.error || !institution.data);
  };

  const refreshUserProfileStatus = async () => {
    if (!user?.id || role !== 'individual') {
      setNeedsUserProfile(false);
      return;
    }

    const res = await profileService.getProfileById(user.id);
    if (!res.error && res.data) {
      setNeedsUserProfile(res.data.profile_completed !== true);
    }
  };

  useEffect(() => {
    let unsubscribe;

    async function init() {
      setLoading(true);

      try {
        const s = await sessionManager.getSession();
        if (s) {
          setSession(s);
          await hydrateSessionUser(s.user || null);
        }

        unsubscribe = sessionManager.onAuthStateChange(async (event, newSession) => {
          setSession(newSession?.session ?? newSession);
          await hydrateSessionUser(newSession?.session?.user ?? newSession?.user ?? null);
        });
      } catch (error) {
        console.warn('Auth bootstrap failed; continuing without a persisted session.', error);
      } finally {
        setLoading(false);
      }
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function signUp(email, password, chosenRole) {
    setLoading(true);
    const roleToPersist = chosenRole || signupRole || 'individual';
    const res = await authService.signUp(email, password, roleToPersist);

    if (res?.data?.user?.id) {
      await profileService.createProfileForUser({
        id: res.data.user.id,
        email,
        role: roleToPersist,
        full_name: email.split('@')[0],
        profile_completed: false,
      });
    }

    setLoading(false);
    return res;
  }

  async function signIn(email, password) {
    setLoading(true);
    const res = await authService.signIn(email, password);
    if (res?.data?.session) {
      setSession(res.data.session);
      await hydrateSessionUser(res.data.session.user);
    }
    setLoading(false);
    return res;
  }

  async function signOut() {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole('individual');
    setNeedsInstitutionProfile(false);
    setNeedsUserProfile(false);
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        needsInstitutionProfile,
        needsUserProfile,
        signupRole,
        setSignupRole,
        loading,
        signIn,
        signUp,
        signOut,
        refreshInstitutionStatus,
        refreshUserProfileStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
