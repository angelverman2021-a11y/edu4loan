import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('student@vitbhopal.ac.in');
    setPassword('StudentPass123!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-vit-navy items-center justify-center text-white shadow-sm mb-2">
          <GraduationCap className="h-6 w-6 text-blue-200" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Portal Sign In</h1>
        <p className="text-sm text-slate-500">
          Save your loan comparisons, track branch visits, and export checklists.
        </p>
      </div>

      <Card className="border-slate-200 shadow-fintech">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@vitbhopal.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftAddon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftAddon={<Lock className="h-4 w-4" />}
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Sign In to Student Portal
            </Button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-brand-700 hover:text-brand-800 font-medium underline"
              >
                Use Demo Credentials
              </button>
              <Link to="/register" className="text-slate-600 hover:text-slate-900">
                New Student? Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
