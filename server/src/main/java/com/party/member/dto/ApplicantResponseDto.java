package com.party.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ApplicantResponseDto {
    private long id;
    private String title;
    private String imageUrl;
    private long boardLikesCount;
}
