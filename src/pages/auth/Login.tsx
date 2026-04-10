import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store';
import { ArrowLeft, AlertCircle, CheckCircle, ShoppingCart, BarChart3 } from '@/lib/icons';

export function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { login, error: authError, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    clearError();

    const result = await login(email, password);
    
    if (result.success) {
      const redirectTo = searchParams.get('redirect');
      
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate('/home');
      }
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex min-h-screen relative">
        {/* Connecting gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent pointer-events-none z-10"></div>
        {/* Left Side - Enhanced Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-slate-50 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="w-full max-w-md animate-fadeInUp relative z-10">
            {/* Enhanced Logo/Brand */}
            <div className="text-center mb-10">
              <Link to="/" className="inline-block group">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-300 shadow-2xl shadow-orange-500/25">
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl mx-auto blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                  Cerka
                </h1>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">B2B Trading Platform</span>
                  <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                </div>
              </Link>
              <p className="text-slate-600 mt-4 text-lg">{t('login.welcomeBack')}</p>
            </div>

            {/* Enhanced Error Message */}
            {(error || authError) && (
              <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl text-red-700 text-sm animate-fadeIn shadow-lg shadow-red-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Authentication Error</div>
                    <div className="text-red-600">{error || authError}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    {t('login.email')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('login.emailPlaceholder')}
                      autoComplete="email"
                      required
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-400 group-hover:border-slate-300"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    {t('login.password')}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      autoComplete="current-password"
                      required
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-400 group-hover:border-slate-300"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="group relative w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    t('login.signInButton')
                  )}
                </span>
              </button>
            </form>

            {/* Enhanced Divider */}
            <div className="mt-10 text-center">
              <p className="text-slate-600">
                {t('login.noAccount')}{' '}
                <Link 
                  to="/register" 
                  className="text-orange-600 hover:text-orange-700 font-bold transition-colors hover:underline decoration-2 underline-offset-2"
                >
                  {t('login.createOne')}
                </Link>
              </p>
            </div>

            {/* Enhanced Back to Home */}
            <div className="mt-8 text-center">
              <Link 
                to="/" 
                className="text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-2 group text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t('login.backToHome')}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Modern Design */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          {/* Sophisticated Background Pattern */}
          <div className="absolute inset-0">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            {/* Animated Gradient Orbs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Content */}
          <div className="relative flex items-center justify-center p-12 text-white">
            <div className="max-w-lg animate-fade-in">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
                  Cerka's Premier
                </h2>
                <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  B2B Marketplace
                </h2>
              </div>
              
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Connect with verified suppliers, discover quality products, and grow your business with confidence.
              </p>
              
              {/* Feature Cards */}
              <div className="space-y-6">
                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <ShoppingCart className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-white">Marketplace Access</h3>
                    <p className="text-blue-200 leading-relaxed">Browse thousands of products from verified suppliers across Rwanda with Cerka</p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-white">Market Intelligence</h3>
                    <p className="text-blue-200 leading-relaxed">Get real-time price insights and market trends to make informed decisions</p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-white">Trusted Network</h3>
                    <p className="text-blue-200 leading-relaxed">Connect with verified businesses and build lasting partnerships</p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-6 text-sm text-blue-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Verified Suppliers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Secure Platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span>Quality Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
