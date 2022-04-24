from shapely.geometry import LineString

from utils.radio_helpers.client_side import ClientCoordinate


def simplify_route(coordinates):
    coordinates_map = map(lambda x: (x.lat, x.lon), coordinates)
    coordinates_list = list(coordinates_map)
    ls = LineString(coordinates_list)

    # preserve_topology=False is faster, according to docs
    simplified = ls.simplify(0.000005, preserve_topology=True)
    s_list = list(simplified.coords)
    s_obj_map = map(lambda x: ClientCoordinate(x[0], x[1]), s_list)
    return list(s_obj_map)
