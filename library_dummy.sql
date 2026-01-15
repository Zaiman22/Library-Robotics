--
-- PostgreSQL database dump
--

\restrict hgf3et5L5ACJOtU3CTbrpMyD3agcLwZRAZ6pgSaDrPilOoCyalUhDKUMdTiVBGK

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg12+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: library; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.library (
    id bigint NOT NULL,
    title text NOT NULL,
    author text,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.library OWNER TO admin;

--
-- Name: library_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.library_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.library_id_seq OWNER TO admin;

--
-- Name: library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.library_id_seq OWNED BY public.library.id;


--
-- Name: library id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.library ALTER COLUMN id SET DEFAULT nextval('public.library_id_seq'::regclass);


--
-- Data for Name: library; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.library (id, title, author, description, created_at) FROM stdin;
\.


--
-- Name: library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.library_id_seq', 1, false);


--
-- Name: library library_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.library
    ADD CONSTRAINT library_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict hgf3et5L5ACJOtU3CTbrpMyD3agcLwZRAZ6pgSaDrPilOoCyalUhDKUMdTiVBGK

