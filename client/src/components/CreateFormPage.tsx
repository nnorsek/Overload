import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

type CreateFormPageProps = {
    title: string;
    description: string;
    backLabel: string;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    disabled: boolean;
    children: React.ReactNode;
}

export default function CreateFormPage({ title, description, backLabel, onBack, onSubmit, submitLabel, disabled, children }: CreateFormPageProps) {
    return (
        <div className="min-h-screen p-8">
            <Button onClick={onBack} className="mb-8">
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
            </Button>

            <div className="max-w-xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground mt-2">{description}</p>
                </div>

                <div className="bg-form border border-border rounded-2xl shadow p-8">
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        {children}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={disabled} className="bg-blue-500 hover:bg-blue-600 text-white">
                                {submitLabel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
