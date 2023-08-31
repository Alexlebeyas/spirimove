import { PageContainer } from '@/components';
import MyContestScore from '@/components/MyContestScore';
import { SpiriMoveProgress } from '@/components/SpiriMoveProgress';
import { useContest } from '@/hooks/useContest';

export const MySpiriMove = () => {
  const { contest } = useContest();
  return (
    <PageContainer>
      {contest ? (
        <>
          <MyContestScore contestId={contest.id.toString()} />
          <SpiriMoveProgress contest={contest} />
        </>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};
