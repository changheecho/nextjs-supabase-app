import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/types/database";

// 프로필 카드 컴포넌트 - 사용자 프로필 정보 표시
interface ProfileCardProps {
  profile: Profile
  email: string
}


export function ProfileCard({ profile, email }: ProfileCardProps) {
  // 프로필이 비어있는지 확인
  const isProfileEmpty = !profile.full_name && !profile.username && !profile.website && !profile.bio

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{profile.full_name || "프로필 없음"}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </div>
          {profile.username && <Badge variant="secondary">{profile.username}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProfileEmpty ? (
          <div className="text-sm text-muted-foreground italic">프로필을 작성해 보세요.</div>
        ) : (
          <>
            {profile.bio && (
              <div>
                <p className="text-sm font-medium">자기소개</p>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            {profile.website && (
              <div>
                <p className="text-sm font-medium">웹사이트</p>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
