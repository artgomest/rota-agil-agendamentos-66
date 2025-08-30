import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Calendar, CreditCard, Heart, MapPin, Phone, DollarSign, Stethoscope } from "lucide-react";
import { SlotViavel } from "@/hooks/useOptimizedScheduling";

interface AgendamentoFormData {
  nome: string;
  dataNascimento: string;
  cpf: string;
  convenio: string;
  numeroCarteirinha: string;
  nomeMae: string;
  medicamentos: string;
  endereco: string;
  cidade: string;
  telefone: string;
  taxa: string;
  examesParticulares: string;
}

interface AgendamentoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: SlotViavel | null;
  onConfirm: (data: AgendamentoFormData) => void;
}

const AgendamentoForm = ({ open, onOpenChange, slot, onConfirm }: AgendamentoFormProps) => {
  const form = useForm<AgendamentoFormData>({
    defaultValues: {
      nome: "",
      dataNascimento: "",
      cpf: "",
      convenio: "",
      numeroCarteirinha: "",
      nomeMae: "",
      medicamentos: "",
      endereco: "",
      cidade: "",
      telefone: "",
      taxa: "",
      examesParticulares: ""
    }
  });

  const onSubmit = (data: AgendamentoFormData) => {
    onConfirm(data);
    onOpenChange(false);
    form.reset();
  };

  // Auto-preenchimento fictício quando o nome é "Maria Luiza Braga Gabrich"
  const handleNomeChange = (nome: string) => {
    if (nome.toLowerCase().includes("maria luiza braga gabrich")) {
      form.setValue("dataNascimento", "02/03/2021");
      form.setValue("cpf", "187.345.466-00");
      form.setValue("convenio", "Unimed");
      form.setValue("numeroCarteirinha", "0.006.0503.667.947.30-6");
      form.setValue("nomeMae", "Ana Carolina Braga de Moura");
      form.setValue("endereco", "Rua capitão Antônio Joaquim da paixão 295 apt 401 centro");
      form.setValue("cidade", "Contagem");
      form.setValue("telefone", "3198205 7966");
      form.setValue("taxa", "60,00");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-wine">
            <Calendar className="h-5 w-5" />
            Dados do Paciente - Agendamento
          </DialogTitle>
          {slot && (
            <p className="text-sm text-muted-foreground">
              Agendamento para {slot.dataHora} com {slot.colhedor}
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4 text-wine" />
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome completo do paciente"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNomeChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data de Nascimento */}
              <FormField
                control={form.control}
                name="dataNascimento"
                rules={{ required: "Data de nascimento é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-wine" />
                      DN (Data de Nascimento)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="DD/MM/AAAA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CPF */}
              <FormField
                control={form.control}
                name="cpf"
                rules={{ required: "CPF é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Convênio */}
              <FormField
                control={form.control}
                name="convenio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-wine" />
                      💳 Convênio
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do convênio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Número da Carteirinha */}
              <FormField
                control={form.control}
                name="numeroCarteirinha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Carteirinha</FormLabel>
                    <FormControl>
                      <Input placeholder="Número da carteirinha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nome da Mãe */}
            <FormField
              control={form.control}
              name="nomeMae"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-wine" />
                    Nome da Mãe
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo da mãe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Medicamentos */}
            <FormField
              control={form.control}
              name="medicamentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-wine" />
                    💊 Medicamentos
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste os medicamentos em uso"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Endereço */}
              <FormField
                control={form.control}
                name="endereco"
                rules={{ required: "Endereço é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-wine" />
                      📍 Endereço
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cidade */}
              <FormField
                control={form.control}
                name="cidade"
                rules={{ required: "Cidade é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-wine" />
                      📍 Cidade
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Telefone */}
              <FormField
                control={form.control}
                name="telefone"
                rules={{ required: "Telefone é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-wine" />
                      📞 Telefone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Taxa */}
              <FormField
                control={form.control}
                name="taxa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-wine" />
                      🏷️ Taxa
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="R$ 0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exames Particulares */}
              <FormField
                control={form.control}
                name="examesParticulares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-wine" />
                      💰 Particulares
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="R$ 0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-wine hover:bg-wine-dark"
              >
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AgendamentoForm;