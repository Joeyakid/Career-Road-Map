import DashboardContent from "@/components/dashboard/dashboard-content";
import { demoDashboardUser } from "@/data/demo-dashboard";

export default function DashboardPreviewPage() {
  return <DashboardContent demoUser={demoDashboardUser} isPreview />;
}
