import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { IconKeyboard } from "@tabler/icons-react";

export default function ShortcutsPage() {
  const shortcuts = [
    {
      category: "General",
      items: [
        {
          key: "Space",
          description: "Iniciar / Pausar",
        },
        {
          key: "Backspace",
          description: "Reiniciar",
        },
      ],
    },
    {
      category: "Modo Zen",
      items: [
        {
          key: "Esc",
          description: "Salir",
        },
        {
          key: "Space",
          description: "Toggle Play",
        },
        {
          key: "Backspace",
          description: "Reiniciar",
        },
      ],
    },
    {
      category: "Volumen",
      items: [
        {
          key: "Ctrl + ↑",
          description: "Subir volumen",
        },
        {
          key: "Ctrl + ↓",
          description: "Bajar volumen",
        },
        {
          key: "End",
          description: "Mutear / Desmutear",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-10 text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
          <IconKeyboard className="h-6 w-6 text-primary" stroke={1.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Atajos de Teclado</h1>
        <p className="text-muted-foreground text-sm">
          Optimiza tu flujo de trabajo.
        </p>
      </div>

      <div className="grid gap-6">
        {shortcuts.map((section) => (
          <Card key={section.category} className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-medium text-muted-foreground uppercase tracking-wider text-xs">
                {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.items.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 group"
                >
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                    {shortcut.description}
                  </span>
                  <Kbd className="bg-muted/50 border-border/50 text-foreground/70 font-sans">
                    {shortcut.key}
                  </Kbd>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
