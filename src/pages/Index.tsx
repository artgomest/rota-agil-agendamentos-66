import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, BarChart, Settings, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <header className="bg-gradient-primary text-white shadow-wine">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold">Rota Ágil</h1>
              <p className="text-xl text-wine-light">Sistema Inteligente de Agendamento de Coletas</p>
            </div>
            
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Otimize suas rotas de coleta com algoritmos inteligentes, integração com Google Calendar 
              e gestão completa de pacientes e agendamentos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="bg-white text-wine hover:bg-white/90">
                <Link to="/dashboard">
                  <Calendar className="h-5 w-5 mr-2" />
                  Acessar Dashboard
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/admin">
                  <Settings className="h-5 w-5 mr-2" />
                  Painel Administrativo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine mb-4">Funcionalidades Principais</h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa para gerenciar suas coletas de forma eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-soft hover:shadow-wine transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wine">
                  <Calendar className="h-5 w-5" />
                  Agendamento Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Algoritmo avançado que otimiza automaticamente as rotas considerando distância, 
                  tempo de viagem e disponibilidade dos colhedores.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-wine transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wine">
                  <MapPin className="h-5 w-5" />
                  Integração Google Maps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utiliza APIs do Google Maps para geocodificação, cálculo de distâncias 
                  e otimização de rotas em tempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-wine transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wine">
                  <Users className="h-5 w-5" />
                  Gestão de Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema completo para cadastro, busca e gestão de informações 
                  dos pacientes com interface intuitiva.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-wine transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wine">
                  <Clock className="h-5 w-5" />
                  Sincronização Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integração nativa com Google Calendar para sincronização automática 
                  dos agendamentos de cada colhedor.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-wine transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wine">
                  <BarChart className="h-5 w-5" />
                  Relatórios e Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dashboards com métricas de performance, estatísticas de coletas 
                  e relatórios detalhados para tomada de decisão.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-wine transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wine">
                  <Settings className="h-5 w-5" />
                  Configuração Flexível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema configurável com pesos personalizáveis para o algoritmo 
                  de otimização e gestão de múltiplos laboratórios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-wine mb-6">Por que escolher o Rota Ágil?</h2>
              
              <div className="space-y-4">
                {[
                  "Redução de até 40% no tempo de rotas",
                  "Interface intuitiva e fácil de usar",
                  "Integração completa com Google Workspace",
                  "Algoritmo inteligente de otimização",
                  "Relatórios detalhados em tempo real",
                  "Suporte a múltiplos laboratórios"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-wine rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="shadow-wine">
                <CardHeader>
                  <CardTitle className="text-wine">Laboratório Paula Castro</CardTitle>
                  <Badge className="bg-success w-fit">Cliente Ativo</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Coletas realizadas:</span>
                      <Badge className="bg-wine">1.247</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de sucesso:</span>
                      <Badge className="bg-success">98.5%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Economia em combustível:</span>
                      <Badge className="bg-wine">R$ 8.500</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-primary text-white rounded-2xl p-12 shadow-wine">
            <h2 className="text-3xl font-bold mb-4">Pronto para otimizar suas coletas?</h2>
            <p className="text-xl text-wine-light mb-8 max-w-2xl mx-auto">
              Junte-se aos laboratórios que já economizam tempo e dinheiro com o Rota Ágil
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-wine hover:bg-white/90">
                <Link to="/dashboard">
                  Começar Agora
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wine text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Rota Ágil</h3>
            <p className="text-wine-light mb-4">Sistema de Agendamento de Coletas</p>
            <div className="flex justify-center space-x-6">
              <Link to="/dashboard" className="hover:text-wine-light transition-colors">
                Dashboard
              </Link>
              <Link to="/admin" className="hover:text-wine-light transition-colors">
                Administração
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;