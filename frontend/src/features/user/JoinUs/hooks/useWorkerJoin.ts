import WorkerProfileService from "@/services/worker/workerProfile.service";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import type { JoinWorkerSchemaType } from "../validation/JoinWorkerFormSchema";
import { profileApi } from "@/features/profile/api/profile.api";
import type { ResubmitDocumentPayload } from "@/types/worker";

export function useWorkerJoin () {
    const queryClient = useQueryClient();

    const [ userQuery , workerQuery ] = useQueries({
        queries:[
            {
                queryKey:["user" ,"me"],
                queryFn:profileApi.getProfilePage,
                staleTime: 1000 * 60 * 5
            },
            {
                queryKey:["worker","me"],
                queryFn: WorkerProfileService.getMe,
                staleTime: 1000 * 60 * 5
            }
        ]
    }) 
    const joinWorker = useMutation({
       mutationFn: ({
            userId,
            data,
            }: {
            userId: string;
            data: JoinWorkerSchemaType;
        }) => WorkerProfileService.addWorkerProfile(userId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ["worker" ,"me"]})
        }
    })

    const resubmitWorker = useMutation({
        mutationFn: ({
            workerId,
            data,
            }: {
            workerId: string;
            data: ResubmitDocumentPayload ;
        }) => WorkerProfileService.reSubmitWorkerInfo(workerId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey :["worker" ,"me"]})
        }
    })

    return {
        user: userQuery.data,
        worker:workerQuery.data,
        isLoading: userQuery.isLoading || workerQuery.isLoading,

        joinWorker,
        resubmitWorker
    }

}