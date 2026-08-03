import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listVoyages, createVoyage, updateVoyage, deleteVoyage, genererVoyagesManuellement } from "../../services/voyages/voyagesService";
import type { Voyage } from "../../types/voyages";

export function useVoyages() {
  return useQuery({
    queryKey: ["voyages"],
    // Encapsulé : React Query passe son contexte en 1er argument, qui serait
    // pris pour le filtre `periode` de listVoyages.
    queryFn: () => listVoyages(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useCreateVoyage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Voyage>) => createVoyage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voyages"] });
    },
  });
}

export function useUpdateVoyage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Voyage> }) => updateVoyage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voyages"] });
    },
  });
}

export function useDeleteVoyage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVoyage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voyages"] });
    },
  });
}

export function useGenererVoyages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => genererVoyagesManuellement(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voyages"] });
    },
  });
}
