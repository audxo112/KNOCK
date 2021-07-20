import random
from django.db import connection


class RandomMixin(object):
    def apply_random(self, page):
        if not page or page == "1" or page == 1:
            self.generate_seed()
        self.seed = self.get_seed()

        self.postgres_setseed()

    def get_seed(self):
        if not self.request.session.get("seed"):
            return self.generate_seed()
        else:
            return self.request.session.get("seed")

    def generate_seed(self):
        self.request.session["seed"] = random.random()
        return self.request.session["seed"]

    def postgres_setseed(self):
        cursor = connection.cursor()
        cursor.execute("SELECT setseed(%s);" % (self.seed,))
        cursor.close()
