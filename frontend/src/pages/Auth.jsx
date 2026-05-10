import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User, Loader2, ChevronRight, ChevronLeft, Check } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();


  // Registration Wizard State
  const [step, setStep] = useState(1);
  const totalSteps = 3;



  const [formData, setFormData] = useState({
    username: '', // Login
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '', // Signup
    phone: '',
    city: '',
    country: '',
    additionalInfo: '',

  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccessMsg('');
  };



  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMsg('');
    setStep(1);

  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.email.includes('@')) return 'Please enter a valid email address';
      if (formData.password.length < 8) return 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    }
    if (step === 2) {
      if (formData.firstName.trim().length < 2) return 'First name is required';
      if (formData.lastName.trim().length < 2) return 'Last name is required';
    }
    return null;
  };

  const handleNext = () => {
    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isLogin) {
      if (!formData.username || formData.password.length < 8) {
        setError('Please enter your email and password');
        return;
      }
    } else {
      if (!formData.city || !formData.country) {
        setError('City and Country are required');
        return;
      }
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.username,
          password: formData.password,
        });
        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        
        // 1. Sign up user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { 
              full_name: fullName,
              phone: formData.phone,
              city: formData.city,
              country: formData.country,
              additional_info: formData.additionalInfo
            }
          }
        });
        if (signUpError) throw signUpError;

        setSuccessMsg('Registration successful! Check your email to confirm your account.');
      }
    } catch (err) {
      if (err.message.includes('500') || err.message.includes('Database')) {
        setError('Server error during registration. Check Supabase Database Triggers or SMTP settings.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    const targetEmail = isLogin ? formData.username : formData.email;
    if (!targetEmail) {
      setError('Please enter your email address first to reset password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail);
      if (error) throw error;
      setSuccessMsg('Password reset link sent to your email.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col md:flex-row animate-fade-in transition-all duration-500 font-sans">
      
      {/* Mobile Logo */}
      <div className="md:hidden flex justify-center items-center py-8">
        <h1 className="text-[#1D9E75] font-bold text-4xl tracking-tight">Traveloop</h1>
      </div>

      {/* LEFT PANEL (Desktop) */}
      <div className="hidden md:flex w-full md:w-[45%] bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex-col justify-center items-center relative overflow-hidden text-center p-8 shadow-2xl z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <svg width="450" height="450" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            <path d="M2 12h20"></path>
          </svg>
        </div>

        <div className="relative z-10 mb-16">
          <h1 className="text-white font-bold text-[56px] tracking-tight leading-tight">Traveloop</h1>
          <p className="text-white/80 text-[20px] mt-3 font-medium">Plan smarter. Travel better.</p>
        </div>

        {/* Floating Cards */}
        <div className="relative w-full max-w-sm h-56 z-10">
          <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-white text-sm font-medium border border-white/20 animate-float">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#E8593C]"></span> Paris → Rome → Barcelona</div>
          </div>
          <div className="absolute top-20 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-white text-sm font-medium border border-white/20 animate-float-delayed">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#1D9E75]"></span> Tokyo → Kyoto → Osaka</div>
          </div>
          <div className="absolute bottom-0 left-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-white text-sm font-medium border border-white/20 animate-float">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white"></span> New York → London</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (Auth Form) */}
      <div className="w-full md:w-[55%] flex flex-col justify-center items-center p-6 sm:p-12 min-h-screen">
        <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5EFE6] p-6 sm:p-10">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-[#6B6B7B] text-sm">
              {isLogin ? 'Enter your details to access your account.' : 'Join Traveloop and start planning.'}
            </p>

            {/* Beautiful Stepper for Registration */}
            {!isLogin && (
              <div className="flex items-center justify-center mt-8 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-500 ${
                      i === step 
                        ? 'bg-[#1D9E75] text-white shadow-lg shadow-[#1D9E75]/40 scale-110' 
                        : i < step 
                          ? 'bg-[#1D9E75] text-white' 
                          : 'bg-[#F5EFE6] text-[#6B6B7B]'
                    }`}>
                      {i < step ? <Check size={14} strokeWidth={3} /> : i}
                    </div>
                    {i < totalSteps && (
                      <div className="w-12 h-[2px] mx-2 bg-[#F5EFE6] rounded-full overflow-hidden relative">
                        <div className={`absolute top-0 left-0 h-full bg-[#1D9E75] transition-all duration-500 ${i < step ? 'w-full' : 'w-0'}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={isLogin ? handleSubmit : (e) => e.preventDefault()} className="space-y-6 w-full overflow-hidden">
            
            {/* LOGIN FORM */}
            {isLogin && (
              <div className="animate-fade-in space-y-5 w-full">
                <div className="space-y-4 w-full">
                  <div className="relative w-full">
                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B6B7B]" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl pl-12 pr-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="relative w-full">
                    <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B6B7B]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl pl-12 pr-12 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-bold text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold text-[#E8593C] hover:text-[#c44329] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A2E] hover:bg-black text-white font-bold py-4 rounded-2xl transition-all duration-300 flex justify-center items-center active:scale-[0.98] shadow-lg shadow-[#1A1A2E]/20"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  Sign In
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#E8E0D5]"></div>
                  <span className="flex-shrink-0 mx-4 text-[#6B6B7B] text-xs font-bold uppercase tracking-wider">or continue with</span>
                  <div className="flex-grow border-t border-[#E8E0D5]"></div>
                </div>

                <button
                  type="button"
                  onClick={handleOAuth}
                  className="w-full bg-white border-2 border-[#F5EFE6] hover:bg-[#FDF8F3] hover:border-[#E8E0D5] text-[#1A1A2E] font-bold py-3.5 rounded-2xl transition-all duration-300 flex justify-center items-center active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </div>
            )}

            {/* REGISTRATION WIZARD */}
            {!isLogin && (
              <div className="animate-fade-in w-full">
                
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in w-full">
                    <div className="relative w-full">
                      <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B6B7B]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl pl-12 pr-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="relative w-full">
                      <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B6B7B]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl pl-12 pr-12 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-bold text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                    <div className="relative w-full">
                      <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B6B7B]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl pl-12 pr-12 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-fade-in w-full">

                    <div className="flex gap-3 w-full">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="flex-1 min-w-0 bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="flex-1 min-w-0 bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                        placeholder="Last Name"
                      />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                      placeholder="Phone Number (Optional)"
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-fade-in w-full">
                    <div className="flex gap-3 w-full">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="flex-1 min-w-0 bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="flex-1 min-w-0 bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all"
                        placeholder="Country"
                      />
                    </div>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      className="w-full bg-[#FDF8F3] border border-[#E8E0D5] rounded-2xl px-4 py-3.5 text-[#1A1A2E] placeholder-[#6B6B7B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all resize-none"
                      rows="3"
                      placeholder="Tell us a bit about your travel style..."
                    ></textarea>
                  </div>
                )}
              </div>
            )}

            {/* ERROR & SUCCESS MESSAGES */}
            <div className="min-h-[20px] my-2">
              {error && <p className="text-xs text-[#E8593C] text-center font-bold animate-fade-in">{error}</p>}
              {successMsg && <p className="text-xs text-[#1D9E75] text-center font-bold animate-fade-in">{successMsg}</p>}
            </div>

            {/* WIZARD BUTTONS */}
            {!isLogin && (
              <div className="flex gap-3 mt-4 w-full">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-14 h-14 flex-shrink-0 bg-[#FDF8F3] text-[#1A1A2E] border border-[#E8E0D5] rounded-2xl flex justify-center items-center hover:bg-[#E8E0D5] transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-[#1A1A2E] hover:bg-black text-white font-bold py-4 rounded-2xl transition-all duration-300 flex justify-center items-center shadow-lg shadow-[#1A1A2E]/20"
                  >
                    Next Step
                    <ChevronRight size={20} className="ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-[#1D9E75] hover:bg-[#158562] text-white font-bold py-4 rounded-2xl transition-all duration-300 flex justify-center items-center shadow-lg shadow-[#1D9E75]/20"
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    Complete Sign Up
                  </button>
                )}
              </div>
            )}

          </form>
          
          {/* BOTTOM CORNER TOGGLE */}
          <div className="mt-8 pt-6 border-t border-[#F5EFE6] text-center">
            <button
              onClick={toggleMode}
              className="text-sm font-bold text-[#6B6B7B] hover:text-[#1D9E75] transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-[#1A1A2E] underline decoration-2 underline-offset-4">
                {isLogin ? "Sign up" : "Login"}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
