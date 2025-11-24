import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameSelect() {
    const [types, setTypes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/game/types`)
            .then((res) => res.json())
            .then((data) => {
                setTypes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur chargement types :", err);
                setLoading(false);
            });
    }, []);

    const selectType = (key: string) => {
        navigate(`/game?boardType=${key}`);
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                <p className="text-muted-foreground text-lg">
                    Chargement des types de parties...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl text-center space-y-10">
                <h1 className="text-4xl font-bold text-foreground">
                    Choisir un type de partie
                </h1>

                <p className="text-muted-foreground text-lg">
                    Sélectionnez le type d’échiquier pour votre partie
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(types).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => selectType(key)}
                            className="p-6 bg-card border border-border rounded-xl hover:shadow-xl hover:border-primary transition-all space-y-3"
                        >
                            <h3 className="text-xl font-semibold text-foreground">
                                {label}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Plateau : {key}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
