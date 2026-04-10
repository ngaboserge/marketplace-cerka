import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import { Users, Building, ArrowLeft, AlertCircle, CheckCircle, ShoppingCart, Shield, Lightning } from '@/lib/icons';

export function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { register, error: authError, clearError } = useAuthStore();
  const [role, setRole] = useState<'buyer' | 'supplier'>(
    (searchParams.get('role') as 'buyer' | 'supplier') || 'buyer'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('register.passwordTooShort'));
      return;
    }

    setLoading(true);
    setError('');
    clearError();

    const result = await register({
      email: formData.email,
      password: formData.password,
      role: role,
      name: formData.name,
      companyName: formData.companyName,
    });

    if (result.success) {
      const dashboardPath = role === 'supplier' ? '/suppliers/listings' : '/buyers/search';
      navigate(dashboardPath);
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex min-h-screen relative">
        {/* Connecting gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent pointer-events-none z-10"></div>
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-slate-50 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="w-full max-w-md animate-fadeInUp relative z-10">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block group">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">Cerka</h1>
              </Link>
              <p className="text-neutral-600">{t('register.createYourAccount')}</p>
            </div>

            {/* Platform Info Banner */}
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl">
              <p className="text-sm font-semibold text-neutral-900 mb-2">{t('register.oneAccountForEverything')}</p>
              <div className="text-xs text-neutral-700 space-y-1">
                <p>• Access Cerka marketplace with thousands of products</p>
                <p>• Get real-time market intelligence and pricing</p>
                <p>• Connect with verified suppliers nationwide</p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-neutral-900 mb-4">
                {t('register.registeringAs')}
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all text-left hover:shadow-md
                    ${role === 'buyer' 
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/20' 
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }
                  `}
                >
                  {role === 'buyer' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 mb-1">{t('register.buyerIndividual')}</div>
                      <div className="text-sm text-neutral-600">{t('register.buyerDesc')}</div>
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole('supplier')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all text-left hover:shadow-md
                    ${role === 'supplier' 
                      ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-500/20' 
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }
                  `}
                >
                  {role === 'supplier' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 mb-1">{t('register.supplierBusiness')}</div>
                      <div className="text-sm text-neutral-600">{t('register.supplierDesc')}</div>
                    </div>
                  </div>
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-3">
                {t('register.roleNote')}
              </p>
            </div>

            {/* Error Message */}
            {(error || authError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error || authError}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('register.fullName')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('register.fullNamePlaceholder')}
                autoComplete="name"
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              {role === 'supplier' && (
                <div>
                  <Input
                    label={t('register.companyName')}
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder={t('register.companyNamePlaceholder')}
                    autoComplete="organization"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}
              <Input
                label={t('register.email')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('register.emailPlaceholder')}
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <Input
                label={t('register.password')}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t('register.createPassword')}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <Input
                label={t('register.confirmPassword')}
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder={t('register.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <Button 
                type="submit" 
                fullWidth
                size="lg"
                loading={loading}
                className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors mt-6"
              >
                {loading ? 'Creating Account...' : t('register.createAccountButton')}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-600">
                {t('register.alreadyHaveAccount')}{' '}
                <Link 
                  to="/login" 
                  className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                >
                  {t('register.signIn')}
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('common.backToHome')}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Modern Design (matching Login page) */}
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
                  Join Cerka's
                </h2>
                <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Business Network
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
                    <p className="text-blue-200 leading-relaxed">Browse products from verified suppliers across Rwanda with Cerka</p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-white">Secure Platform</h3>
                    <p className="text-blue-200 leading-relaxed">Bank-level security with comprehensive verification process</p>
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
