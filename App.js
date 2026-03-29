import { useState } from 'react';
import '@/App.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  TrendingDown, 
  Zap,
  Shield,
  ArrowRight
} from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [status, setStatus] = useState('stable');
  const [actionApproved, setActionApproved] = useState(false);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const ANOMALY_API_URL = process.env.REACT_APP_ANOMALY_API_URL || 'http://localhost:8080/api/anomaly/trigger';
  const mockData = {
    analysis: {
      root_cause: "Payment gateway timeout spike detected on Gateway A during peak transaction hours",
      reasoning_steps: [
        "Analyzed 50,000 transactions in the last hour",
        "Detected 12% failure rate versus 2% baseline",
        "Identified Gateway A processing delays averaging 8.5 seconds",
        "Correlated with 85% increase in concurrent requests",
        "Root cause: Gateway A connection pool saturation"
      ],
      confidence: 0.87,
      financial_impact: "₹1.2L/day"
    },
    playbook: {
      actions: [
        {
          type: "reroute",
          target: "Gateway B",
          expected_impact: "+3%"
        }
      ]
    }
  };
  const triggerAnomaly = async () => {
    setLoading(true);
    setError(null);
    setActionApproved(false);
    
    try {
      const response = await fetch(ANOMALY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger anomaly detection');
      }
      
      const data = await response.json();
      setAnalysisData(data);
      setStatus('anomaly');
    } catch (err) {
      setError(err.message);
      console.error('Error triggering anomaly:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveAction = () => {
    setActionApproved(true);
    setStatus('executed');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-semibold tracking-tight text-slate-50">
              FinMark Sentinel AI
            </h1>
          </div>
          <Badge 
            variant="outline" 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border-slate-700 text-slate-300"
            data-testid="system-badge"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            Live System
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Trigger Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-slate-50 mb-1">
              Anomaly Detection Control
            </h2>
            <p className="text-sm text-slate-400">Trigger AI-powered transaction analysis</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={triggerDemoMode}
              disabled={loading}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 font-medium px-5 py-6 text-base transition-colors duration-150"
              data-testid="demo-mode-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Try Demo Mode
                </>
              )}
            </Button>
          <Button
            onClick={triggerAnomaly}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-6 text-base transition-colors duration-150"
            data-testid="trigger-anomaly-btn"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Trigger Anomaly Detection
              </>
            )}
          </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="bg-rose-950/50 border-rose-900" data-testid="error-alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {actionApproved && (
          <Alert className="bg-emerald-950/50 border-emerald-900" data-testid="success-alert">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <AlertDescription className="text-emerald-400">
              Action approved successfully. System stabilization in progress.
            </AlertDescription>
          </Alert>
        )}
        {/* Demo Mode Badge */}
        {demoMode && (
          <Alert className="bg-blue-950/50 border-blue-900" data-testid="demo-alert">
            <Activity className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-400">
              Demo Mode Active - Showing sample anomaly detection data. Connect your backend API for live analysis.
            </AlertDescription>
          </Alert>
        )}
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Analysis Panel - Spans 2 columns */}
          <Card 
            className="lg:col-span-2 bg-slate-900 border-slate-800 card-hover" 
            data-testid="analysis-panel"
          >
            <CardHeader>
              <CardTitle className="text-xl font-heading font-medium text-slate-50 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                AI Analysis
              </CardTitle>
              <CardDescription className="text-slate-400">
                Machine learning insights and root cause analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysisData ? (
                <>
                  {/* Root Cause */}
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-slate-400 font-semibold">
                      Root Cause
                    </label>
                    <p className="text-base text-slate-200 leading-relaxed" data-testid="root-cause">
                      {analysisData.analysis.root_cause}
                    </p>
                  </div>

                  {/* Reasoning Steps */}
                  <div className="space-y-3">
                    <label className="text-xs tracking-wider uppercase text-slate-400 font-semibold">
                      Reasoning Steps
                    </label>
                    <ul className="space-y-2" data-testid="reasoning-steps">
                      {analysisData.analysis.reasoning_steps.map((step, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-3 text-sm text-slate-300 stagger-fade-in"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {/* Confidence Score */}
                    <div className="space-y-3 p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                      <label className="text-xs tracking-wider uppercase text-slate-400 font-semibold">
                        Confidence Score
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-mono tracking-tight text-white" data-testid="confidence-score">
                            {Math.round(analysisData.analysis.confidence * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={analysisData.analysis.confidence * 100} 
                          className="h-2 bg-slate-800"
                          data-testid="confidence-progress"
                        />
                      </div>
                    </div>

                    {/* Financial Impact */}
                    <div className="space-y-3 p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                      <label className="text-xs tracking-wider uppercase text-slate-400 font-semibold">
                        Financial Impact
                      </label>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-rose-500" />
                        <span className="text-3xl sm:text-4xl font-mono tracking-tight text-rose-400" data-testid="financial-impact">
                          {analysisData.analysis.financial_impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No analysis data available. Trigger anomaly detection to begin.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Action + Status */}
          <div className="space-y-6">
            {/* Action Panel */}
            <Card 
              className="bg-slate-900 border-slate-800 card-hover" 
              data-testid="action-panel"
            >
              <CardHeader>
                <CardTitle className="text-lg font-heading font-medium text-slate-50">
                  Suggested Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisData && analysisData.playbook.actions.length > 0 ? (
                  <>
                    <div className="p-4 rounded-lg bg-blue-950/30 border border-blue-900/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs tracking-wider uppercase text-blue-400 font-semibold">
                          Action Type
                        </span>
                        <Badge className="bg-blue-600 text-white" data-testid="action-type">
                          {analysisData.playbook.actions[0].type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300" data-testid="action-target">
                        <span className="text-slate-400">Target:</span>{' '}
                        <span className="font-medium">{analysisData.playbook.actions[0].target}</span>
                      </p>
                      <p className="text-sm text-emerald-400" data-testid="expected-impact">
                        Expected Impact: {analysisData.playbook.actions[0].expected_impact}
                      </p>
                    </div>
                    <Button
                      onClick={approveAction}
                      disabled={actionApproved}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors duration-150"
                      data-testid="approve-action-btn"
                    >
                      {actionApproved ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Action Approved
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve Action
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="py-8 text-center text-slate-500">
                    <Shield className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No actions pending</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Panel */}
            <Card 
              className="bg-slate-900 border-slate-800 card-hover" 
              data-testid="status-panel"
            >
              <CardHeader>
                <CardTitle className="text-lg font-heading font-medium text-slate-50">
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-400">Anomaly Detection</span>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${status === 'anomaly' || status === 'executed' 
                        ? 'bg-rose-950/50 border-rose-900 text-rose-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                      }
                    `}
                    data-testid="status-anomaly"
                  >
                    {status === 'anomaly' || status === 'executed' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse-dot mr-2" />
                        Detected
                      </>
                    ) : (
                      'Idle'
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-400">Action Status</span>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${status === 'executed' 
                        ? 'bg-emerald-950/50 border-emerald-900 text-emerald-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                      }
                    `}
                    data-testid="status-action"
                  >
                    {status === 'executed' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot mr-2" />
                        Executed
                      </>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-400">System Health</span>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${status === 'executed' 
                        ? 'bg-emerald-950/50 border-emerald-900 text-emerald-400' 
                        : status === 'stable'
                        ? 'bg-emerald-950/50 border-emerald-900 text-emerald-400'
                        : 'bg-amber-950/50 border-amber-900 text-amber-400'
                      }
                    `}
                    data-testid="status-health"
                  >
                    {status === 'executed' || status === 'stable' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot mr-2" />
                        Stable
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot mr-2" />
                        Warning
                      </>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
