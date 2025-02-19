from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('institution', InstitutionViewSet, basename='institution')
router.register('user', UserViewSet, basename='user')
router.register('course', CourseViewSet, basename='course')
router.register('progress', ProgressViewSet, basename='progress')
router.register('enrollment', EnrollmentViewSet, basename='enrollment')
router.register('lesson', LessonViewSet, basename='lesson')
router.register('quiz', QuizViewSet, basename='quiz')
router.register('quiz-question', QuizQuestionViewSet, basename='quiz-question')
router.register('quiz-answer', QuizAnswerViewSet, basename='quiz-answer')
router.register('quiz-result', QuizResultViewSet, basename='quiz-result')
router.register('certification', CertificationViewSet, basename='certification')

urlpatterns = router.urls
