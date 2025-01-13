package com.openclassrooms.starterjwt.mapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;

@ExtendWith(MockitoExtension.class)
public class TeacherMapperTest {

    private TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);

    private TeacherDto mockTeacherDto;
    private Teacher mockTeacher;

    @BeforeEach
    public void beforeEach() {
        LocalDateTime now = LocalDateTime.now();
        mockTeacher = Teacher.builder()
                .id(1L)
                .firstName("Jack")
                .lastName("DOLERTE")
                .createdAt(now)
                .updatedAt(now)
                .build();
        mockTeacherDto = new TeacherDto();
        mockTeacherDto.setId(1L);
        mockTeacherDto.setFirstName("Jack");
        mockTeacherDto.setLastName("DOLERTE");
        mockTeacherDto.setCreatedAt(now);
        mockTeacherDto.setUpdatedAt(now);
    }

    @Test
    public void testToEntity() {
        // Act
        Teacher teacher = teacherMapper.toEntity(mockTeacherDto);

        // Assert
        assertThat(teacher).isNotNull();
        assertThat(teacher).isEqualTo(mockTeacher);
    }

    @Test
    public void testNullDtoToEntity() {
        // Act
        Teacher teacher = teacherMapper.toEntity((TeacherDto) null);

        // Assert
        assertThat(teacher).isNull();
    }

    @Test
    public void testToDto() {
        // Act
        TeacherDto teacherDto = teacherMapper.toDto(mockTeacher);

        // Assert
        assertThat(teacherDto).isNotNull();
        assertThat(teacherDto).isEqualTo(mockTeacherDto);
    }

    @Test
    public void testNullEntityToDto() {
        // Act
        TeacherDto teacherDto = teacherMapper.toDto((Teacher) null);

        // Assert
        assertThat(teacherDto).isNull();
    }

    @Test
    public void testToEntityList() {
        // Arrange
        List<TeacherDto> mockTeacherDtoList = Arrays.asList(mockTeacherDto, mockTeacherDto);

        // Act
        List<Teacher> teacherList = teacherMapper.toEntity(mockTeacherDtoList);

        // Assert
        assertThat(teacherList).isNotNull();
        assertThat(teacherList).hasSize(2);
    }

    @Test
    public void testNullTeacherDtoListToEntityList() {
        // Arrange
        List<TeacherDto> mockTeacherDtoList = null;

        // Act
        List<Teacher> teacherList = teacherMapper.toEntity(mockTeacherDtoList);

        // Assert
        assertThat(teacherList).isNull();
    }

    @Test
    public void testToDtoList() {
        // Arrange
        List<Teacher> mockTeacherList = Arrays.asList(mockTeacher, mockTeacher);

        // Act
        List<TeacherDto> teacherDtoList = teacherMapper.toDto(mockTeacherList);

        // Assert
        assertThat(teacherDtoList).isNotNull();
        assertThat(teacherDtoList).hasSize(2);
    }

    @Test
    public void testNullTeacherListToDtoList() {
        // Arrange
        List<Teacher> mockTeacherList = null;

        // Act
        List<TeacherDto> teacherDtoList = teacherMapper.toDto(mockTeacherList);

        // Assert
        assertThat(teacherDtoList).isNull();
    }

}
