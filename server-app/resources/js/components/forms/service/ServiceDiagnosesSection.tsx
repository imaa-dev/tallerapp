import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { ServiceIssue } from '@/types';
import { Clock, DollarSign, Pencil, Stethoscope } from 'lucide-react';

interface ServiceDiagnosesSectionProps {
    issues: ServiceIssue[];
    onEdit: (issue: ServiceIssue) => void;
}

export default function ServiceDiagnosesSection({ issues, onEdit }: ServiceDiagnosesSectionProps) {
    const diagnosedIssues = issues.filter((issue) => issue.attend && issue.diagnosis);

    if (diagnosedIssues.length === 0) {
        return null;
    }

    return (
        <Card className="m-5 mt-10 max-w-4xl p-6">
            <SidebarGroupLabel>Diagnósticos del servicio</SidebarGroupLabel>

            <div className="space-y-4">
                {diagnosedIssues.map((issue) => (
                    <div key={issue.id} className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                                    <p className="font-medium text-gray-900 dark:text-white">{issue.issue}</p>
                                </div>

                                <div className="mt-2 space-y-1 pl-6">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{issue.diagnosis}</p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        {issue.repair_time && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {issue.repair_time}
                                            </span>
                                        )}
                                        {issue.cost != null && (
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                {issue.cost.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(issue)} className="shrink-0">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
