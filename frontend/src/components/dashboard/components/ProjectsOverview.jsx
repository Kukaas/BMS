import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const projects = [
    {
        name: "Road Improvement",
        progress: 75,
    },
    {
        name: "Community Center Renovation",
        progress: 50,
    },
    {
        name: "Waste Management Program",
        progress: 90,
    },
];

function ProjectsOverview() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {projects.map((project, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {project.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {project.progress}% complete
                                    </p>
                                </div>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default ProjectsOverview;
