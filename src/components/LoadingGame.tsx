import { User as UserClass } from "@/context/AuthContext";
import { useEffect } from "react";

interface Props {
    user: UserClass;
    setupGame: (data: any) => void;
}

export default function LoadingGame({ user, setupGame }: Props) {
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/game/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                boardType: "standard",
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setupGame(data);
            })
            .catch((err) => {
                console.error("Erreur matchmaking :", err);
            });
    }, []);

    return (
        <div className="text-center text-muted-foreground">
            Recherche d’une partie...
        </div>
    );
}
