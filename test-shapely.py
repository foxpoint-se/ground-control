from example_route import example_route
from shapely.geometry import LineString


if __name__ == "__main__":
    coordinates_map = map(lambda x: (x["lat"], x["lon"]), example_route)

    coordinates_list = list(coordinates_map)

    print(coordinates_list[:10])

    ls = LineString(coordinates_list)
    print(len(ls.coords))

    # preserve_topology=False is faster, according to docs
    simplified = ls.simplify(0.000005, preserve_topology=True)

    s_list = list(simplified.coords)
    print(len(s_list))
    print(s_list)

    s_obj_map = map(lambda x: {"lat": x[0], "lon": x[1]}, s_list)
    print(list(s_obj_map))
