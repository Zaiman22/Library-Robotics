import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";


export default function backButton(){
    const navigate = useNavigate()
    return(
        <Button
                variant="secondary"
                className="absolute top-6 left-6 z-20 shadow-lg"
                onClick={() => navigate(-1)}
            >
                ⬅ Kembali
            </Button>
    )
}