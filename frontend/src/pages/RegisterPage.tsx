import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vitReg, setVitReg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        vitRegistrationNumber: vitReg || undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-vit-navy items-center justify-center text-white shadow-sm mb-2">
          <GraduationCap className="h-6 w-6 text-blue-200" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Student Account</h1>
        <p className="text-sm text-slate-500">
          Sign up to personalize your loan checklists and track your application milestones.
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
              label="Full Name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              leftAddon={<User className="h-4 w-4" />}
            />

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
              label="VIT Registration Number (Optional)"
              type="text"
              placeholder="e.g. 23BCI10001"
              value={vitReg}
              onChange={(e) => setVitReg(e.target.value)}
              leftAddon={<BookOpen className="h-4 w-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftAddon={<Lock className="h-4 w-4" />}
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Create Student Account
            </Button>

            <div className="pt-2 border-t border-slate-100 text-center text-sm">
              <Link to="/login" className="text-brand-700 hover:text-brand-800 font-medium">
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
