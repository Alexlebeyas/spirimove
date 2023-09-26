from rest_framework.pagination import PageNumberPagination


class FeedPagination(PageNumberPagination):
    """Class representing feed pagination"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
    page_query_param = 'p'
