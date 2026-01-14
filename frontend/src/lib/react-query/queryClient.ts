import { handleApiError } from "@/utils/handleApiError";
import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const queryClient = new QueryClient({
    defaultOptions : {
        queries: {
            retry :false
        },
        mutations: {
            onError: (error) => {
                if(error instanceof AxiosError) {
                    const status = error.response?.status;
                    if(status === 401 ) {return;}
                }
                toast.error(handleApiError(error));
            }
        }
    }
})