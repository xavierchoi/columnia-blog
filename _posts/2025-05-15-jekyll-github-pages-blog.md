---
layout: post
title: "Jekyll과 GitHub Pages로 무료 블로그 만들기"
date: 2025-05-15 10:00:00 +0900
category: "블로그 개발하기"
tags: [Jekyll, GitHub Pages, 블로그, 정적사이트]
excerpt: "정적 사이트 생성기 Jekyll을 사용해 GitHub Pages에서 완전 무료로 개인 블로그를 구축하는 방법을 단계별로 알아봅시다."
author: "Columnia"
featured: true
image: "/assets/images/jekyll-blog.jpg"
views: 1234
reading_time: 5
lang: ko
permalink: /blog-development/jekyll-github-pages-blog/
---

# Jekyll과 GitHub Pages로 무료 블로그 만들기

정적 사이트 생성기 Jekyll을 사용하여 GitHub Pages에서 완전 무료로 개인 블로그를 구축하는 방법을 단계별로 알아보겠습니다.

## Jekyll이란?

Jekyll은 Ruby로 작성된 정적 사이트 생성기입니다. Markdown 파일을 HTML로 변환하여 정적 웹사이트를 생성해줍니다.

### 주요 장점

- **무료 호스팅**: GitHub Pages 완전 무료
- **빠른 속도**: 정적 파일이므로 로딩이 빠름
- **보안**: 서버 사이드 코드가 없어 보안 위험 최소화
- **버전 관리**: Git을 통한 완벽한 버전 관리

## 시작하기

### 1. 필요한 도구 설치

```bash
# Ruby 설치 확인
ruby -v

# Jekyll 설치
gem install jekyll bundler
```