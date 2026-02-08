import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useToast } from '../components/ToastProvider';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const navigate = useNavigate();
  const { signIn, profile, user } = useAuth();
  const { push } = useToast();

  // Redirect if already logged in or after successful login
  useEffect(() => {
    // If we have a user AND a profile, we are good to go.
    // If we just have a user but no profile yet, we wait (AuthContext is loading).
    if (user && profile) {
      const rolePortalMap: Record<string, string> = {
        super_admin: '/dashboard/super-admin',
        admin: '/dashboard/admin',
        teacher: '/dashboard/teacher',
        student: '/dashboard/student',
        driver: '/dashboard/driver',
        parent: '/dashboard/parent',
      };
      const portal = rolePortalMap[profile.role] ?? '/dashboard/student';
      navigate(portal, { replace: true });
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signIn(email, password);
      // The useEffect will handle the redirect once profile is loaded
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Unable to authenticate.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please try again later.';
      }
      setError(msg);
      push({ type: 'error', title: 'Login Failed', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    setError(null);
    setForgotPasswordLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      push({ type: 'success', title: 'Email Sent', message: 'Check your inbox for password reset instructions.' });
    } catch (err: any) {
      console.error('Password reset error:', err);
      let msg = 'Failed to send reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      }
      setError(msg);
      push({ type: 'error', title: 'Error', message: msg });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--brand-purple)] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--brand-orange)] rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10 animate-fade-up">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img src="/logo-full.png" alt="Schools24" className="h-12 mx-auto object-contain" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-white/60">Sign in with your issued account</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-dark border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)] focus:border-transparent transition-all"
                  placeholder="name@school.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordLoading}
                    className="text-sm text-[var(--brand-orange)] hover:underline disabled:opacity-50"
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-14 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-[var(--brand-orange)] to-orange-600 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5 transition-all duration-200 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-white/60">
                Need access?{' '}
                <Link to="/register" className="text-[var(--brand-orange)] font-medium hover:underline">
                  Register your school
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold">Access Policy</h3>
            <p className="text-sm text-white/60 mt-2">
              Accounts are issued only after your school is approved. Use the school registration form to request access.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'Step 1: Submit school registration',
                'Step 2: Verification by Schools24 team',
                'Step 3: Admin credentials issued',
                'Step 4: Admin invites staff & students',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/70">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-orange)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-sm text-white/40">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Help</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
