import json
import mpu
import numpy
import networkx as nx

name_to_point = {
    "ТЦ ДА": 17,
    "Фитнес-центр": 18,
    "ЦУМ": 19,
    "Аквамолл": 20,
    "Альянс": 21,
    "ТЦ Заря": 22,
}

def get_lengths():
    A = {}
    for name in name_to_point.keys():
        A[name] = {}
        for name2 in name_to_point.keys():
            if name != name2:
                A[name][name2] = get_path_l(name, name2)
    print(A)

def find_path(adjacency_matrix, source_node_index, target_node_index):
    matrix = numpy.matrix(adjacency_matrix)
    graph = nx.from_numpy_matrix(matrix)
    path = nx.astar_path(graph, source=source_node_index, target=target_node_index)
    length = sum((graph[u][v]["weight"] for u, v in zip(path[:-1], path[1:])))
    return path, length

def get_path(pos1, pos2):
    graph, points = get_points()
    points = points['pos']
    i1 = name_to_point[pos1]
    i2 = name_to_point[pos2]
    path, l = find_path(graph, i1, i2)
    print(path)
    return list(map(lambda x: points[x], path))

def get_path_l(pos1, pos2):
    graph, points = get_points()
    points = points['pos']
    i1 = name_to_point[pos1]
    i2 = name_to_point[pos2]
    path, l = find_path(graph, i1, i2)
    return l

def get_points():
    with open ('mavlink/graph.json', 'r') as f:
        graph = json.load(f)
    with open ('mavlink/points.json', 'r') as f:
        points = json.load(f)
    for i in range(len(graph)):
        for j in range(len(graph)):
            if (graph[i][j]):
                graph[i][j] = distance(points['pos'][i], points['pos'][j])
    return graph, points

def distance(pos1, pos2):
    return mpu.haversine_distance(pos1, pos2)

# get_lengths()
# print(get_path([54.333, 48.3945],
#         [54.31777, 48.39601]))