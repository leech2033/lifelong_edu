import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Institutions from "@/pages/institutions/index";
import Contests from "@/pages/contests/index";
import ApplicationSubmit from "@/pages/application/submit";
import Resources from "@/pages/resources";
import AchievementBooks from "@/pages/performance/books";
import BestPractices from "@/pages/performance/best-practices";
import PerformanceMedia from "@/pages/performance/media";
import InstitutionDetail from "@/pages/institutions/detail";
import DamoaCourseList from "@/pages/damoa/index";
import OnlineLectureList from "@/pages/online/index";
import OnlineLectureDetail from "@/pages/online/detail";
import LocalProgramList from "@/pages/local/index";
import LocalProgramDetail from "@/pages/local/detail";
import Dashboard from "@/pages/dashboard";
import InstitutionQualityPage from "@/pages/internal/institution-quality";
import DaejeonCrawlPage from "@/pages/internal/daejeon-crawl";

function Router() {
  const enableInternalPages = import.meta.env.VITE_ENABLE_INTERNAL_PAGES === "true";

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/institutions" component={Institutions} />
      <Route path="/institutions/detail/:id" component={InstitutionDetail} />
      <Route path="/institutions/crawl-temp" component={DaejeonCrawlPage} />
      
      {/* Damoa Routes */}
      <Route path="/damoa" component={DamoaCourseList} />
      
      {/* New Senior Friendly Routes */}
      <Route path="/online" component={OnlineLectureList} />
      <Route path="/online/:id" component={OnlineLectureDetail} />
      <Route path="/local" component={LocalProgramList} />
      <Route path="/local/:id" component={LocalProgramDetail} />
      
      {/* Legacy Online Courses Route (Redirect or keep for compatibility) */}
      <Route path="/online-courses" component={OnlineLectureList} />

      <Route path="/contests" component={Contests} />
      {enableInternalPages && <Route path="/dashboard" component={Dashboard} />}
      {enableInternalPages && <Route path="/dashboard/:sub" component={Dashboard} />}
      {enableInternalPages && <Route path="/internal/institution-quality" component={InstitutionQualityPage} />}
      <Route path="/temp/daejeon-crawl" component={DaejeonCrawlPage} />
      <Route path="/application" component={ApplicationSubmit} />
      <Route path="/application/submit" component={ApplicationSubmit} />
      <Route path="/resources" component={Resources} />
      <Route path="/performance/books" component={AchievementBooks} />
      <Route path="/performance/best-practices" component={BestPractices} />
      <Route path="/performance/media" component={PerformanceMedia} />
      <Route path="/performance" component={AchievementBooks} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
