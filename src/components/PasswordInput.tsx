import React from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Lock size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Protection par mot de passe</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Entrez un mot de passe sécurisé"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              className={cn(
                "pr-10",
                passwordsMatch && "border-green-500 focus:ring-green-500",
                passwordsDontMatch && "border-destructive focus:ring-destructive"
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          
          {password && confirmPassword && (
            <div className="flex items-center space-x-2 text-sm">
              {passwordsMatch ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-500">Les mots de passe correspondent</span>
                </>
              ) : (
                <>
                  <X size={16} className="text-destructive" />
                  <span className="text-destructive">Les mots de passe ne correspondent pas</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};