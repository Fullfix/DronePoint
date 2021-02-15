import json

def get_path(pos1, pos2):
    graph, points = get_points()
    points = points['pos']
    i1 = points.index(pos1)
    i2 = points.index(pos2)
    print(i1, i2)

def get_points():
    with open ('graph.json', 'r') as f:
        graph = json.load(f)
    with open ('points.json', 'r') as f:
        points = json.load(f)
    print(graph, points)
    return graph, points

get_path([54.2798, 48.3157],
        [54.3209, 48.3775])