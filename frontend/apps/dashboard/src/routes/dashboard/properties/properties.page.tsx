import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Input } from "@repo/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Building,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  MapPin,
  User,
  Crown,
} from "lucide-react";
import type { FC } from "react";

export const PropertiesPage: FC = () => {
  const properties = [
    {
      id: 1,
      name: "Appartement Rue de la Paix",
      address: "123 Rue de la Paix, 75001 Paris",
      type: "Appartement",
      surface: "65 m²",
      tenant: "Marie Martin",
      tenantSince: "Janvier 2023",
      status: "Action requise",
      nextObligation: {
        type: "Contrôle gaz",
        date: "15 Mars 2024",
        daysLeft: 15,
        urgent: true,
      },
      obligations: [
        { type: "DPE", status: "valid", expiresIn: "8 ans" },
        { type: "Contrôle gaz", status: "urgent", expiresIn: "15 jours" },
        { type: "Diagnostic électrique", status: "valid", expiresIn: "3 ans" },
        { type: "Ramonage", status: "warning", expiresIn: "2 mois" },
      ],
    },
    {
      id: 2,
      name: "Studio Boulevard Voltaire",
      address: "45 Boulevard Voltaire, 75011 Paris",
      type: "Studio",
      surface: "25 m²",
      tenant: "Thomas Dubois",
      tenantSince: "Septembre 2023",
      status: "À surveiller",
      nextObligation: {
        type: "Entretien chaudière",
        date: "23 Mars 2024",
        daysLeft: 23,
        urgent: false,
      },
      obligations: [
        { type: "DPE", status: "warning", expiresIn: "6 mois" },
        { type: "Contrôle gaz", status: "valid", expiresIn: "2 ans" },
        {
          type: "Entretien chaudière",
          status: "warning",
          expiresIn: "23 jours",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "destructive";
      case "warning":
        return "default";
      case "valid":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes logements</h1>
          <p className="text-muted-foreground">
            Gérez vos propriétés et leurs obligations légales
          </p>
        </div>
        <Button disabled className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un logement</span>
        </Button>
      </div>

      {/* Stats et limite */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logements</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 / 2</div>
            <p className="text-xs text-muted-foreground">
              Limite gratuite atteinte
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actions urgentes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">
              Intervention requise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Obligations à jour
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
            <p className="text-xs text-muted-foreground">
              Sur 7 obligations totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <Crown className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">
                  Passez à Premium pour plus de logements
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gérez un nombre illimité de propriétés et accédez au réseau
                  d'artisans certifiés
                </p>
              </div>
            </div>
            <Button>Découvrir Premium</Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un logement..." className="pl-10" />
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-xl">{property.name}</CardTitle>
                    <Badge
                      variant={
                        property.status === "À jour"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {property.type} - {property.surface}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Voir les documents
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Planifier intervention
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Building className="mr-2 h-4 w-4" />
                      Modifier le logement
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Tenant Info */}
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{property.tenant}</p>
                  <p className="text-sm text-muted-foreground">
                    Locataire depuis {property.tenantSince}
                  </p>
                </div>
              </div>

              {/* Next Obligation */}
              <div className="p-4 border rounded-lg bg-background">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Prochaine échéance</h4>
                  <Badge
                    variant={
                      property.nextObligation.urgent ? "destructive" : "default"
                    }
                  >
                    {property.nextObligation.daysLeft} jours
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {property.nextObligation.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {property.nextObligation.date}
                    </p>
                  </div>
                  <Button size="sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    Planifier
                  </Button>
                </div>
              </div>

              {/* Obligations Overview */}
              <div className="space-y-3">
                <h4 className="font-medium">Aperçu des obligations</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {property.obligations.map((obligation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{obligation.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {obligation.status === "valid"
                            ? "Expire dans"
                            : "Action requise dans"}{" "}
                          {obligation.expiresIn}
                        </p>
                      </div>
                      <Badge
                        variant={getStatusColor(obligation.status)}
                        className="text-xs"
                      >
                        {obligation.status === "valid"
                          ? "✓"
                          : obligation.status === "urgent"
                          ? "!"
                          : "⚠"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  Documents
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  Calendrier
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Crown className="h-3 w-3 mr-1" />
                  Trouver artisan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
