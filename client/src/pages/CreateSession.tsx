import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFormPage from "../components/CreateFormPage";
import { useSessionHooks, type CreateSessionPayload } from "@/hooks/SessionHooks";
import { useClientHooks } from "@/hooks/ClientHooks";
import { useWorkoutHooks } from "@/hooks/WorkoutHooks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultForm: CreateSessionPayload = {
  clientIds: [],
  workoutId: 0,
  scheduledStart: "",
  scheduledEnd: "",
  notes: "",
};

export default function CreateSession() {
  const navigate = useNavigate();
  const { createSession, isSubmitting } = useSessionHooks();
  const { clients } = useClientHooks();
  const { workouts } = useWorkoutHooks();

  const [form, setForm] = useState<CreateSessionPayload>(defaultForm);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleClient = (clientId: number) => {
    setForm((prev) => ({
      ...prev,
      clientIds: prev.clientIds.includes(clientId)
        ? prev.clientIds.filter((id) => id !== clientId)
        : [...prev.clientIds, clientId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      await createSession(form);
      navigate("/sessions");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const blankFields =
    form.clientIds.length === 0 ||
    form.workoutId === 0 ||
    form.scheduledStart === "" ||
    form.scheduledEnd === "";

  return (
    <CreateFormPage
      title="Create Session"
      description="Schedule a new training session for one or more clients"
      backLabel="Back to Sessions"
      onBack={() => navigate("/sessions")}
      onSubmit={handleSubmit}
      submitLabel="Create Session"
      disabled={blankFields}
      submitting={isSubmitting}
      error={submitError}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Clients</Label>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto rounded-lg border border-border p-2">
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2 py-1">No clients found</p>
          ) : (
            clients.map((client) => {
              const selected = form.clientIds.includes(client.clientId);
              return (
                <button
                  key={client.clientId}
                  type="button"
                  onClick={() => toggleClient(client.clientId)}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm text-left transition-colors ${
                    selected
                      ? "bg-blue-500 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <span>
                    {client.firstName} {client.lastName}
                  </span>
                  {selected && <span className="text-xs font-medium">✓</span>}
                </button>
              );
            })
          )}
        </div>
        {form.clientIds.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {form.clientIds.length} client{form.clientIds.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workout">Workout</Label>
        <Select
          value={form.workoutId === 0 ? "" : String(form.workoutId)}
          onValueChange={(val) =>
            setForm((prev) => ({ ...prev, workoutId: Number(val) }))
          }
        >
          <SelectTrigger id="workout" className="w-full">
            <SelectValue placeholder="Select a workout" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {workouts.map((w) => (
                <SelectItem key={w.workoutId} value={String(w.workoutId)}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scheduledStart">Start</Label>
        <Input
          id="scheduledStart"
          type="datetime-local"
          value={form.scheduledStart}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, scheduledStart: e.target.value }))
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scheduledEnd">End</Label>
        <Input
          id="scheduledEnd"
          type="datetime-local"
          value={form.scheduledEnd}
          min={form.scheduledStart}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, scheduledEnd: e.target.value }))
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Any notes for this session..."
          rows={3}
        />
      </div>
    </CreateFormPage>
  );
}
