from shapely.geometry import LineString


class Coordinate:
    def __init__(self, lat=None, lon=None) -> None:
        self.lat = lat
        self.lon = lon


def simplify_route(coordinates):
    coordinates_map = map(lambda x: (x.lat, x.lon), coordinates)
    coordinates_list = list(coordinates_map)
    ls = LineString(coordinates_list)

    # preserve_topology=False is faster, according to docs. But using True until it becomes a problem.
    # The tolerance 0.000005 seems to be a good value after some testing and tweaking.
    # For a quite complicated route, it preserves about 56 % of original (i. e. reduces 44 %).
    # But in a simple route, it can reduce a lot more.
    # See the tests in the images and their file names as attached in this PR:
    # https://github.com/foxpoint-se/ground-control/pull/7
    simplified = ls.simplify(0.000005, preserve_topology=True)
    s_list = list(simplified.coords)
    s_obj_map = map(lambda x: Coordinate(x[0], x[1]), s_list)
    return list(s_obj_map)
