import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-16 p-6 container mx-auto max-w-3xl">
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-orange-600">Paiement Annulé</h2>
          <p className="text-lg">Votre paiement a été annulé.</p>
          <p className="text-lg">Aucun frais n'a été débité de votre compte.</p>
          <div className="space-y-2">
            <Button onClick={() => navigate("/checkout")} className="w-full max-w-xs mx-auto">
              Réessayer
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
              Retour à l'Accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;
