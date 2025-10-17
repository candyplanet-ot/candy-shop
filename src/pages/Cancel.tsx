import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-16 p-6 container mx-auto max-w-3xl">
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-orange-600">Payment Cancelled</h2>
          <p className="text-lg">Your payment was cancelled.</p>
          <p className="text-lg">No charges have been made to your account.</p>
          <div className="space-y-2">
            <Button onClick={() => navigate("/checkout")} className="w-full max-w-xs mx-auto">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;
