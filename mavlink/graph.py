import json
import mpu

def get_path(pos1, pos2):
    graph, points = get_points()
    points = points['pos']
    i1 = points.index(pos1)
    i2 = points.index(pos2)

def get_points():
    with open ('graph.json', 'r') as f:
        graph = json.load(f)
    with open ('points.json', 'r') as f:
        points = json.load(f)
    for i in range(len(graph)):
        for j in range(len(graph)):
            if (graph[i][j]):
                graph[i][j] = distance(points['pos'][i], points['pos'][j])
    return graph, points

def distance(pos1, pos2):
    return mpu.haversine_distance(pos1, pos2)

get_path([54.2798, 48.3157],
        [54.3209, 48.3775])