import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, FileBarChart, Activity, ShieldCheck, MoreVertical } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart } from "recharts";

export const Route = createFileRoute("/app/admin")({ component: Admin });

const users = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: ["Aanya Patel", "Liam Chen", "Maya Rao", "Noah Singh", "Sofia Müller", "Diego Costa", "Yuki Tanaka", "Priya Iyer"][i],
  email: `user${i + 1}@ecotrack.ai`,
  role: i === 0 ? "Admin" : "User",
  points: 1500 + Math.round(Math.random() * 4000),
  status: i === 7 ? "Suspended" : "Active",
}));

const newUsersGraph = Array.from({ length: 12 }).map((_, i) => ({ m: i + 1, v: Math.round(200 + Math.random() * 400) }));
const trafficGraph = Array.from({ length: 7 }).map((_, i) => ({ d: ["M","T","W","T","F","S","S"][i], v: 4000 + Math.round(Math.random() * 3000) }));

function Admin() {
  return (
    <AppShell title="Admin Panel" subtitle="Manage users, content, and platform metrics">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { t: "Total users", v: "92,408", icon: Users },
          { t: "Active challenges", v: "182", icon: Trophy },
          { t: "Reports generated", v: "1,204", icon: FileBarChart },
          { t: "Avg engagement", v: "78%", icon: Activity },
        ].map(s => (
          <Card key={s.t} className="glass p-5 flex items-center gap-4">
            <span className="h-10 w-10 rounded-xl gradient-bg grid place-items-center"><s.icon className="h-5 w-5 text-primary-foreground" /></span>
            <div><div className="text-xs uppercase text-muted-foreground">{s.t}</div><div className="font-display text-2xl font-bold">{s.v}</div></div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="metrics">Sustainability metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="glass p-0 mt-4">
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Eco Points</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>{u.role === "Admin" ? <Badge className="gradient-bg text-primary-foreground border-0">Admin</Badge> : <Badge variant="outline">User</Badge>}</TableCell>
                    <TableCell className="font-mono">{u.points.toLocaleString()}</TableCell>
                    <TableCell>{u.status === "Active" ? <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">Active</Badge> : <Badge variant="destructive">Suspended</Badge>}</TableCell>
                    <TableCell><Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card className="glass p-6 mt-4">
            <div className="flex justify-between items-center mb-4"><h3 className="font-display font-semibold">Challenge management</h3><Button className="gradient-bg text-primary-foreground border-0">+ New challenge</Button></div>
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>XP</TableHead><TableHead>Duration</TableHead><TableHead>Participants</TableHead></TableRow></TableHeader>
              <TableBody>
                {[
                  ["7-Day Plastic-Free Challenge", "lifestyle", 500, "7d", 12480],
                  ["Walk Instead of Drive", "transport", 300, "7d", 9420],
                  ["Energy Saving Week", "energy", 400, "7d", 7320],
                  ["Tree Planting Mission", "nature", 800, "30d", 4180],
                ].map(([t, c, x, d, p], i) => (
                  <TableRow key={i}><TableCell className="font-medium">{t}</TableCell><TableCell>{c}</TableCell><TableCell className="font-mono">{x}</TableCell><TableCell>{d}</TableCell><TableCell className="font-mono">{(p as number).toLocaleString()}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <Card className="glass p-6"><h3 className="font-display font-semibold">New users / month</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={newUsersGraph}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Bar dataKey="v" fill="#00C853" radius={[6,6,0,0]} /></BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="glass p-6"><h3 className="font-display font-semibold">Daily active users</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trafficGraph}><XAxis dataKey="d" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip contentStyle={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} /><Line dataKey="v" stroke="#64DD17" strokeWidth={3} dot={{ r: 4 }} /></LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <Card className="glass p-6 mt-4">
            <h3 className="font-display font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Platform-wide sustainability</h3>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {[
                { t: "Total CO₂ tracked", v: "2.48M t" },
                { t: "Trees equivalent saved", v: "184,200" },
                { t: "Challenges completed", v: "412,840" },
              ].map(s => (<div key={s.t} className="p-4 rounded-xl glass"><div className="text-xs uppercase text-muted-foreground tracking-wider">{s.t}</div><div className="font-display text-2xl font-bold mt-1 gradient-text">{s.v}</div></div>))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
