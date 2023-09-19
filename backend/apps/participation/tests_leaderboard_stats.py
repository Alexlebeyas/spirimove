import datetime
from enum import IntEnum

from django.test import TestCase

from apps.contest.models import ContestsModel
from apps.participation.models import ParticipationModel, ParticipationTypeModel
from apps.participation.views import Stat, get_leaderboard_stats
from apps.users.models import User


class Participation(IntEnum):
    NORMAL = 0
    POPUP = 1
    KOFTH = 2


class ParticipationModelTestCase(TestCase):
    def setUp(self):
        self.ctx = self.withStandardContest()

    def test_find_single_user_no_streak(self):
        """Non-consecutive days are not counted as a streak"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(2))
        self.withParticipationInContext(date=day(4))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=3, days=3, streak=1)]),
        )

    def test_find_single_user_no_streak_repeated_days(self):
        """Multiple participations per day are not counted as a streak"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(2))
        self.withParticipationInContext(date=day(2))
        self.withParticipationInContext(date=day(2))
        self.withParticipationInContext(date=day(4))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=3, days=3, streak=1)]),
        )

    def test_find_single_user_one_streak(self):
        """Consecutive days are counted as a streak"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(1))
        self.withParticipationInContext(date=day(2))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=3, days=3, streak=3)]),
        )

    def test_find_single_user_unapproved_verifications(self):
        """Unapproved participations are NOT counted as a streak"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(
            date=day(1), status=ParticipationModel.IN_VERIFICATION
        )
        self.withParticipationInContext(date=day(1), status=ParticipationModel.REJECTED)
        self.withParticipationInContext(date=day(2))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=2, days=2, streak=1)]),
        )

    def test_find_single_user_one_streak_repeated_days(self):
        """Consecutive days with multiple participations are counted as a streak"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(1))
        self.withParticipationInContext(date=day(1))
        self.withParticipationInContext(date=day(2))
        self.withParticipationInContext(date=day(2))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=3, days=3, streak=3)]),
        )

    def test_find_single_user_one_streak_random_order(self):
        """Only the date of a participation counts for streak (order of id doesn't matter)"""
        self.withParticipationInContext(date=day(2))
        self.withParticipationInContext(date=day(1))
        self.withParticipationInContext(date=day(3))
        self.withParticipationInContext(date=day(0))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=4, days=4, streak=4)]),
        )

    def test_find_single_user_one_streak_with_different_types(self):
        """Different types of participations counts for streak"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(1), type_index=Participation.POPUP)
        self.withParticipationInContext(date=day(2), type_index=Participation.KOFTH)
        self.withParticipationInContext(date=day(3))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=4, days=4, streak=4)]),
        )

    def test_find_single_user_two_streaks(self):
        """Only longest streak counts"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(1))
        self.withParticipationInContext(date=day(4))
        self.withParticipationInContext(date=day(5))
        self.withParticipationInContext(date=day(6))

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=5, days=5, streak=3)]),
        )

    def test_find_single_user_extra_participations(self):
        """Multiple type of participations per day are not counted as a streak"""
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(0), type_index=Participation.POPUP)
        self.withParticipationInContext(date=day(0), type_index=Participation.KOFTH)

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=3, days=1, streak=1)]),
        )

    def test_find_single_user_max_point_per_participation_type_per_day(self):
        """
        With multiple same participation type per day,
        only counts the maximum of points per participation type
        """
        self.withParticipationInContext(date=day(0))
        self.withParticipationInContext(date=day(0), is_intensive=True)
        self.withParticipationInContext(date=day(0), type_index=Participation.POPUP)
        self.withParticipationInContext(
            date=day(0), type_index=Participation.POPUP, is_organizer=True
        )
        self.withParticipationInContext(date=day(0), type_index=Participation.KOFTH)
        self.withParticipationInContext(
            date=day(0), type_index=Participation.KOFTH, is_organizer=True
        )

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=6, days=1, streak=1)]),
        )

    def test_find_single_user_extra_points_is_intensive(self):
        """Count 1 extra point for intensive participation"""
        self.withParticipationInContext(date=day(0), is_intensive=True)

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=2, days=1, streak=1)]),
        )

    def test_find_single_user_extra_participations_extra_points(self):
        """Count 1 extra point for intensive participation with multiple participations"""
        self.withParticipationInContext(date=day(0), is_intensive=True)
        self.withParticipationInContext(date=day(0), type_index=Participation.POPUP)

        streaks = get_leaderboard_stats(contest=self.ctx["contest"])

        self.assertEqual(
            set(streaks),
            set([userStat(id=1, points=3, days=1, streak=1)]),
        )

    #
    # helpers
    #

    def withStandardContest(self):
        u = self.withUser("user1@spiria.com", display_name="user1")
        c = self.withContest(name="Spirimove")
        t = [
            self.withParticipationType(name="Normal", can_be_intensive=True),
            self.withParticipationType(
                name="Popup", can_add_more_by_day=True, can_have_organizer=True
            ),
            self.withParticipationType(name="KOTH", can_have_organizer=True),
        ]
        return {"user": u, "contest": c, "types": t}

    def withUser(self, email, display_name=""):
        return User.objects.create(email=email, display_name=display_name)

    def withContest(
        self,
        name,
        start_date=datetime.date.today(),
        end_date=datetime.date.today() + datetime.timedelta(days=24),
        is_open=True,
    ):
        return ContestsModel.objects.create(
            name=name, start_date=start_date, end_date=end_date, is_open=is_open
        )

    def withParticipationType(
        self,
        name,
        can_be_intensive=False,
        can_add_more_by_day=False,
        can_have_organizer=False,
    ):
        return ParticipationTypeModel.objects.create(
            name=name,
            can_be_intensive=can_be_intensive,
            can_add_more_by_day=can_add_more_by_day,
            can_have_organizer=can_have_organizer,
        )

    def withParticipationInContext(
        self,
        user=None,
        type_index=Participation.NORMAL,
        is_intensive=False,
        is_organizer=False,
        description="",
        status=ParticipationModel.APPROVED,
        date=datetime.date.today(),
    ):
        return self.withParticipation(
            user=user or self.ctx["user"],
            type=self.ctx["types"][type_index],
            is_intensive=is_intensive,
            is_organizer=is_organizer,
            contest=self.ctx["contest"],
            description=description,
            status=status,
            date=date,
        )

    def withParticipation(
        self,
        user,
        contest,
        type,
        is_intensive=False,
        is_organizer=False,
        description="",
        status="APPROVED",
        date=datetime.date.today(),
    ):
        return ParticipationModel.objects.create(
            user=user,
            contest=contest,
            type=type,
            is_intensive=is_intensive,
            is_organizer=is_organizer,
            description=description,
            status=status,
            date=date,
        )


# generic helpers


def userStat(id, points, days, streak):
    return Stat(
        **{
            "user__email": "user%d@spiria.com" % id,
            "user__profile_picture": "",
            "user__office": None,
            "user__display_name": "user%d" % id,
            "total_points": points,
            "total_days": days,
            "max_consecutive_days": streak,
        }
    )


def day(number):
    """Return a datetime `number` days after today."""
    return datetime.date.today() + datetime.timedelta(days=number)
