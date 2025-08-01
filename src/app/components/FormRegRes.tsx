'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod/v3";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const formSchema = z.object({
    type: z.enum(["entry", "exit"]),
}
)  

export default function FormMovimento(){
    const [newEntry, setNewEntry] = useState({
        plate: "",
        driver: "",
        type: "entry" as "entry" | "exit",
        purpose: "",
    })
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "entry",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>){
        alert("caiu: \n" + values.type)
    }
    return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Adcionar Movimento
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adcionar Entrada</DialogTitle>
                        <DialogDescription>Adcionar a entrada ou saída de pessoas e veiculos</DialogDescription>
                    </DialogHeader>
                    <div>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
                            <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Tipo de Movimento</Label>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full mt-3">
                                        <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="entry">Entrada</SelectItem>
                                        <SelectItem value="exit">Saída</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                            )}
                            />
                            <Button type="submit">Adcionar</Button>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
                
            </Dialog>
    )
}