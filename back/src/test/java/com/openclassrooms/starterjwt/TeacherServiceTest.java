package com.openclassrooms.starterjwt;

import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher mockFirstTeacher;
    private Teacher mockSecondTeacher;

    private List<Teacher> mockteachers;

    @BeforeEach
    public void beforeEach() {
        mockteachers = new ArrayList<>();

        mockFirstTeacher = Teacher.builder()
                .id(1L)
                .firstName("Jack")
                .lastName("DOLERTE")
                .build();
        mockSecondTeacher = Teacher.builder()
                .id(2L)
                .firstName("Lily")
                .lastName("BLOOM")
                .build();

        mockteachers.add(mockFirstTeacher);
        mockteachers.add(mockSecondTeacher);
    }

    @Test
    public void testFindAll() {
        // Arrange
        when(teacherRepository.findAll()).thenReturn(mockteachers);

        // Act
        List<Teacher> teachers = teacherService.findAll();

        // Assert
        assertThat(teachers).isNotNull();
        assertThat(teachers).hasSize(2);
        assertThat(teachers).containsExactly(mockFirstTeacher, mockSecondTeacher);
        verify(teacherRepository).findAll();
    }

    @Test
    public void testFindById() {
        // Arrange
        when(teacherRepository.findById(mockFirstTeacher.getId())).thenReturn(Optional.of((mockFirstTeacher)));

        // Act
        Teacher teacher = teacherService.findById(mockFirstTeacher.getId());

        // Assert
        assertThat(teacher).isNotNull();
        assertThat(teacher.getFirstName()).isEqualTo("Jack");
        verify(teacherRepository).findById(mockFirstTeacher.getId());
    }

    @Test
    public void testFindByIdNotFound() {
        // Arrange
        when(teacherRepository.findById((long) 15)).thenReturn(Optional.empty());

        // Act
        Teacher teacher = teacherService.findById((long) 15);

        // Assert
        assertThat(teacher).isNull();
        verify(teacherRepository).findById((long) 15);
    }

}
