import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { MemberCard } from "@/components/events/member-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEventMembers } from "@/lib/mock-data";
import type { EventMember } from "@/lib/mock-data";

interface MembersPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { eventId } = await params;
  const members = getEventMembers(eventId);

  const pendingMembers = members.filter((m) => m.status === "pending");
  const approvedMembers = members.filter((m) => m.status === "approved");
  const rejectedMembers = members.filter((m) => m.status === "rejected");
  const allMembers = members;

  const renderMemberList = (memberList: EventMember[], status?: string) => {
    if (memberList.length === 0) {
      let emptyMessage = "해당하는 참여자가 없습니다";
      if (status === "pending") emptyMessage = "대기 중인 신청이 없습니다";
      if (status === "approved") emptyMessage = "승인된 참여자가 없습니다";
      if (status === "rejected") emptyMessage = "거절된 신청이 없습니다";

      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {memberList.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isOrganizerView={true}
            onApprove={(memberId) => console.log(`승인: ${memberId}`)}
            onReject={(memberId) => console.log(`거절: ${memberId}`)}
            onRemove={(memberId) => console.log(`제거: ${memberId}`)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <Link href={`/protected/events/${eventId}`}>
        <Button variant="ghost" size="sm" className="h-12">
          <ArrowLeft className="mr-2 h-4 w-4" />
          모임으로 돌아가기
        </Button>
      </Link>

      <div>
        <h1 className="text-2xl font-bold md:text-3xl">참여자 관리</h1>
        <p className="mt-2 text-muted-foreground">
          모임의 참여자를 상태별로 관리할 수 있습니다
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-2 md:h-10 md:grid-cols-4">
          <TabsTrigger value="all">전체 ({allMembers.length})</TabsTrigger>
          <TabsTrigger value="pending">
            대기 ({pendingMembers.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            승인 ({approvedMembers.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            거절 ({rejectedMembers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderMemberList(allMembers, "all")}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {renderMemberList(pendingMembers, "pending")}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {renderMemberList(approvedMembers, "approved")}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {renderMemberList(rejectedMembers, "rejected")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
