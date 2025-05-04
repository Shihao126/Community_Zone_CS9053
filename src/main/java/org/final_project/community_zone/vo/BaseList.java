package org.final_project.community_zone.vo;

import lombok.Data;

import java.util.HashMap;
import java.util.List;

@Data
public class BaseList<T> {
    private Integer size;
    private HashMap<Integer, T> list;

    public BaseList(List<T> data) {
        size = data.size();
        list = new HashMap<Integer, T>();
        for (int i = 0; i < size; i++) {
            list.put(i, data.get(i));
        }
    }
}
