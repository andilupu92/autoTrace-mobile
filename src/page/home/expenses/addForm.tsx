import { useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function formatDateNice(iso: string): string {
  const d = new Date(iso);
  const months = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

interface Transaction {
  name: string;
  date: string;
  amount: number;
}

interface AddFormProps {
  accentColor: string;
  onAdd: (tx: Transaction) => void;
  onCancel: () => void;
}

export default function AddForm({ accentColor, onAdd, onCancel }: AddFormProps) {
  const [name, setName]     = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate]     = useState(todayISO());
  const [errors, setErrors] = useState({ name: false, amount: false, date: false });
 
  function handleSave() {
    const hasNameErr   = !name.trim();
    const hasAmountErr = !amount || Number(amount) <= 0;
    const hasDateErr   = !date;
 
    if (hasNameErr || hasAmountErr || hasDateErr) {
      setErrors({ name: hasNameErr, amount: hasAmountErr, date: hasDateErr });
      return;
    }
 
    onAdd({
      name: name.trim(),
      date: formatDateNice(date),
      amount: Number(amount),
    });
 
    setName("");
    setAmount("");
    setDate(todayISO());
    setErrors({ name: false, amount: false, date: false });
  }
 
  return (
    <VStack className="gap-2.5 mt-2.5">
 
      {/* Name input */}
      <Input
        className={`rounded-xl bg-gray-50 border ${
          errors.name ? "border-orange-500" : "border-gray-200"
        }`}
      >
        <InputField
          placeholder="Denumire (ex: Rompetrol)"
          value={name}
          onChangeText={(v) => {
            setName(v);
            setErrors((p) => ({ ...p, name: false }));
          }}
          className="text-sm text-gray-900"
        />
      </Input>
 
      {/* Amount + Date row */}
      <HStack className="gap-2">
        <Input
          className={`flex-1 rounded-xl bg-gray-50 border ${
            errors.amount ? "border-orange-500" : "border-gray-200"
          }`}
        >
          <InputField
            placeholder="Sumă (RON)"
            value={amount}
            onChangeText={(v) => {
              setAmount(v);
              setErrors((p) => ({ ...p, amount: false }));
            }}
            keyboardType="numeric"
            className="text-sm text-gray-900"
          />
        </Input>
 
        {/* Simple date text input — use a DateTimePicker lib if needed */}
        <Input
          className={`flex-1 rounded-xl bg-gray-50 border ${
            errors.date ? "border-orange-500" : "border-gray-200"
          }`}
        >
          <InputField
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={(v) => {
              setDate(v);
              setErrors((p) => ({ ...p, date: false }));
            }}
            className="text-sm text-gray-900"
          />
        </Input>
      </HStack>
 
      {/* Actions */}
      <HStack className="gap-2">
        <Button
          onPress={handleSave}
          className="flex-1 rounded-xl bg-gray-900 active:bg-gray-800"
        >
          <ButtonText className="text-sm font-semibold text-white">
            Salvează
          </ButtonText>
        </Button>
 
        <Button
          onPress={onCancel}
          variant="outline"
          className="rounded-xl border-gray-200 bg-gray-100 active:bg-gray-200"
        >
          <ButtonText className="text-sm font-semibold text-gray-500">
            Anulează
          </ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}