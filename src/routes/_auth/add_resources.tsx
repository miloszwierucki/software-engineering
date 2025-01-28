import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { api } from "@/utils/api";
import { protectRoute } from "@/routes/_auth";

export const Route = createFileRoute('/_auth/add_resources')({
  beforeLoad: ({ context }) => {
    protectRoute(context, ['charity']);
  },
  component: RouteComponent,
})

interface Resource {
  id: number;
  type: string;
  name: string;
  quantity: number;
  available: boolean;
  volunteer?: {
    userId: number;
  };
  donation?: {
    donation_id: number;
  };
}

function RouteComponent() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api<Resource[]>("/resource/", "GET");
        setResources(response);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    fetchResources();
  }, []);

  const handleStatusChange = async (id: number, value: string) => {
    try {
      const resource = resources.find(r => r.id === id);
      if (!resource) return;

      const updatedResource = {
        ...resource,
        available: value === 'accepted'
      };

      await api<Resource>(
        `/resource/${id}`,
        "PUT",
        updatedResource
      );

      setResources(prevResources =>
        prevResources.map(resource =>
          resource.id === id
            ? { ...resource, available: value === 'accepted' }
            : resource
        )
      );
    } catch (error) {
      console.error("Failed to update resource:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      const acceptedResources = resources.filter(r => r.available);
      const rejectedResources = resources.filter(r => !r.available);
      
      console.log('Accepted resources:', acceptedResources);
      console.log('Rejected resources:', rejectedResources);
      
    } catch (error) {
      console.error("Failed to confirm resources:", error);
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">
            {t("add_resources.title")}
          </h1>
          <p className="ml-1 font-light text-gray-600">
            {t("add_resources.subtitle")}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("add_resources.unconfirmed")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("add_resources.category")}</TableHead>
                  <TableHead>{t("add_resources.name")}</TableHead>
                  <TableHead className="text-right">{t("add_resources.amount")}</TableHead>
                  <TableHead className="text-center">{t("add_resources.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.type}</TableCell>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell className="text-right">{resource.quantity}</TableCell>
                    <TableCell>
                      <RadioGroup
                        onValueChange={(value) => handleStatusChange(resource.id, value)}
                        className="flex space-x-4 justify-center"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="accepted" id={`accept-${resource.id}`} />
                          <Label htmlFor={`accept-${resource.id}`}>{t("add_resources.accept")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rejected" id={`reject-${resource.id}`} />
                          <Label htmlFor={`reject-${resource.id}`}>{t("add_resources.reject")}</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button 
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground"
          >
            {t("add_resources.button")}
          </Button>
        </div>
      </div>
    </>
  )
}
