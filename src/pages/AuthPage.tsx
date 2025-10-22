import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette } from 'lucide-react';
import { Toaster, toast } from 'sonner';
export function AuthPage() {
  const navigate = useNavigate();
  const { login, signup, isLoggedIn } = useAuthStore();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginEmail, loginPassword);
    if (success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error('Invalid email or password.');
    }
  };
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const success = signup(signupName, signupEmail, signupPassword);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Could not create account.');
    }
  };
  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen flex items-center justify-center bg-secondary dark:bg-background p-4">
        <div className="absolute inset-0 bg-gradient-mesh-hero" />
        <div className="relative z-10 flex flex-col items-center space-y-4 mb-8">
          <div className="flex items-center gap-2 text-foreground">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-display tracking-tight">
              Artisan Canvas
            </h1>
          </div>
          <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="admin@cloudflare.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input id="login-password" type="password" placeholder="password123" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>Create a new account to start designing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Name</Label>
                      <Input id="signup-name" type="text" placeholder="Your Name" required value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="you@example.com" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">Create Account</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}