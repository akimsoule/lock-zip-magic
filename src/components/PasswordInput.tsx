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

  // Validation de force du mot de passe
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthText = (strength: number) => {
    if (strength < 2) return { text: "Très faible", color: "text-red-500" };
    if (strength < 3) return { text: "Faible", color: "text-orange-500" };
    if (strength < 4) return { text: "Moyen", color: "text-yellow-500" };
    if (strength < 5) return { text: "Fort", color: "text-green-500" };
    return { text: "Très fort", color: "text-green-600" };
  };

  const strengthInfo = getStrengthText(passwordStrength);

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
          
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Force du mot de passe:</span>
                <span className={strengthInfo.color}>{strengthInfo.text}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    passwordStrength < 2 ? 'bg-red-500 w-1/5' :
                    passwordStrength < 3 ? 'bg-orange-500 w-2/5' :
                    passwordStrength < 4 ? 'bg-yellow-500 w-3/5' :
                    passwordStrength < 5 ? 'bg-green-500 w-4/5' :
                    'bg-green-600 w-full'
                  }`}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Utilisez au moins 8 caractères avec majuscules, minuscules, chiffres et symboles
              </div>
            </div>
          )}
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