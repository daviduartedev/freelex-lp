import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const WaitlistForm = ({ className = "" }: { className?: string }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) throw error;

            setSuccess(true);
            toast({
                title: "Sucesso!",
                description: "Você entrou para a lista de espera.",
            });
            setEmail('');
        } catch (error: any) {
            console.error('Error submitting to Supabase:', error);

            // Check for duplicate key error (code 23505 in Postgres)
            if (error.code === '23505') {
                toast({
                    variant: "default",
                    title: "Atenção",
                    description: "Este e-mail já está na nossa lista de espera.",
                });
                return;
            }

            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível cadastrar seu e-mail. Tente novamente.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`w-full max-w-sm mx-auto ${className}`}>
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-center gap-2 p-4 bg-green-500/10 text-green-500 rounded-full border border-green-500/20"
                    >
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Cadastrado com sucesso!</span>
                        <button
                            onClick={() => setSuccess(false)}
                            className="ml-2 text-xs underline hover:text-green-600"
                        >
                            Cadastrar outro
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative"
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-14 py-4 rounded-full bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm hover:shadow-md"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground text-center">
                            Entre na <span className="text-primary font-medium">fila de espera</span> e receba novidades em primeira mão.
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WaitlistForm;
